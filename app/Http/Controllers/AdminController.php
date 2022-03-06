<?php

namespace App\Http\Controllers;


use App\Models\Tag;
use App\Models\Category;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function addTag(Request $request)
    {
        //validation request
        $this->validate($request, [
            'tagName' => 'required'
        ]);
        return Tag::create(['tagName' => $request->tagName]);
    }

    public function getTag()
    {
        return Tag::orderBy('id', 'desc')->get();
    }

    public function editTag(Request $request)
    {
        //validation request
        $this->validate($request, [
            'tagName' => 'required',
            'id' => 'required'
        ]);
        return Tag::where('id', $request->id)->update(['tagName' => $request->tagName]);
    }
    public function deleteTag(Request $request)
    {
        //validation request
        $this->validate($request, [
            'id' => 'required'
        ]);
        return Tag::where('id', $request->id)->delete();
    }

    //Category
    public function upload(Request $request)
    {
        $this->validate($request, [
            'file' => 'required|mimes:png,jpg,jpeg'
        ]);
        $image = time() . '.' . $request->file->extension();
        $request->file->move(public_path('uploads'), $image);
        return $image;
    }

    public function deleteImage(Request $request)
    {
        $filename = $request->imageName;
        $this->deleteFileFromServer($filename, false);
        return 'done';
    }

    public function deleteFileFromServer($filename, $hasFullPath = false)
    {
        $filepath = "";
        if (!$hasFullPath) {

            $filepath = public_path() . '/uploads/' . $filename;
        } else {
            $filepath = $filename;
        }

        if (file_exists($filepath)) {
            @unlink($filepath);
        }
        return;
    }

    public function addCategory(Request $request)
    {
        // validate request
        $this->validate($request, [
            'categoryName' => 'required',
            'iconImage' => 'required',
        ]);
        return Category::create([
            'categoryName' => $request->categoryName,
            'iconImage' => $request->iconImage,
        ]);
    }
    public function getCategory()
    {
        return Category::orderBy('id', 'desc')->get();
    }

    public function editCategory(Request $request)
    {

        //validation request
        $this->validate($request, [
            'id' => 'required',
            'categoryName' => 'required',
            'iconImage' => 'required'
        ]);
        return Category::where('id', $request->id)->update([
            'categoryName' => $request->categoryName,
            'iconImage' => $request->iconImage
        ]);
    }

    public function deleteCategory(Request $request)
    {
        $this->deleteFileFromServer($request->iconImage, true);
        //validation request
        $this->validate($request, [
            'id' => 'required',
            'categoryName' => 'required',
            'iconImage' => 'required'
        ]);
        return Category::where('id', $request->id)->delete();
    }
}
